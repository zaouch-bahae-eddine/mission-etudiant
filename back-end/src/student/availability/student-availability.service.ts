import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentAvailability } from './student-availability.model.js';
import {
    type StudentAvailabilityCreateDto,
    type StudentAvailabilityRegistrationDto,
    type StudentAvailabilityUpdateDto,
} from './dto/student-availability.dto.js';
import { type Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';


export type UpdateStudentAvailability = StudentAvailabilityUpdateDto;

function timeToSeconds(time: string): number {
    const [hours, minutes, seconds = 0] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

@Injectable()
export class StudentAvailabilityService {
    constructor(
        @InjectModel(StudentAvailability)
        private readonly studentAvailabilityModel: typeof StudentAvailability,
        private readonly sequelize: Sequelize,
    ) {}

    findOne(id: number): Promise<StudentAvailability | null> {
        return this.studentAvailabilityModel.findByPk(id);
    }

    create(data: StudentAvailabilityCreateDto, transaction?: Transaction): Promise<StudentAvailability> {
        return this.studentAvailabilityModel.create(data, { transaction });
    }

    bulkCreate(data: StudentAvailabilityCreateDto[], transaction?: Transaction): Promise<StudentAvailability[]> {
        return this.studentAvailabilityModel.bulkCreate(data, { transaction })
    }

    async updateForStudent(
        studentId: number,
        data: StudentAvailabilityRegistrationDto,
    ): Promise<StudentAvailability> {
        return this.sequelize.transaction(async (transaction) => {
            const existing = await this.studentAvailabilityModel.findAll({
                where: { studentId, dayOfWeek: data.dayOfWeek },
                order: [['startTime', 'ASC']],
                transaction,
                lock: transaction.LOCK.UPDATE,
            });

            let startTime = data.startTime;
            let endTime = data.endTime;
            let startSeconds = timeToSeconds(startTime);
            let endSeconds = timeToSeconds(endTime);
            const overlapping: StudentAvailability[] = [];

            let foundOverlap = true;
            while (foundOverlap) {
                foundOverlap = false;
                for (const availability of existing) {
                    if (overlapping.includes(availability)) continue;

                    const availabilityStart = timeToSeconds(availability.startTime);
                    const availabilityEnd = timeToSeconds(availability.endTime);

                    if (availabilityStart < endSeconds && availabilityEnd > startSeconds) {
                        overlapping.push(availability);
                        foundOverlap = true;
                        if (availabilityStart < startSeconds) {
                            startTime = availability.startTime;
                            startSeconds = availabilityStart;
                        }
                        if (availabilityEnd > endSeconds) {
                            endTime = availability.endTime;
                            endSeconds = availabilityEnd;
                        }
                    }
                }
            }

            if (overlapping.length === 0) {
                return this.studentAvailabilityModel.create(
                    { ...data, studentId },
                    { transaction },
                );
            }

            const [primary, ...merged] = overlapping.sort(
                (left, right) =>
                    timeToSeconds(left.startTime) -
                    timeToSeconds(right.startTime),
            );
            const [, updated] = await this.studentAvailabilityModel.update(
                { startTime, endTime },
                {
                    where: { id: primary.id },
                    returning: true,
                    transaction,
                },
            );
            if (merged.length > 0) {
                await this.studentAvailabilityModel.destroy({
                    where: { id: merged.map(({ id }) => id) },
                    transaction,
                });
            }

            return updated[0];
        });
    }

    async update(
        id: number,
        data: UpdateStudentAvailability,
    ): Promise<StudentAvailability | null> {
        const [, availabilities] = await this.studentAvailabilityModel.update(
            data,
            {
                where: { id },
                returning: true,
            },
        );
        return availabilities[0] ?? null;
    }

    async delete(id: number): Promise<boolean> {
        const deletedRows = await this.studentAvailabilityModel.destroy({
            where: { id },
        });
        return deletedRows > 0;
    }
}
