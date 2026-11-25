import {
    studentAvailabilitySchema,
    studentAvailabilityUpdateSchema,
} from '../dto/student-availability.dto.js';

describe('Student availability DTOs', () => {
    const data = {
        studentId: 12,
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '12:00',
    };

    it('accepts a valid availability', () => {
        expect(studentAvailabilitySchema.parse(data)).toEqual(data);
    });

    it.each([
        { studentId: 0 },
        { dayOfWeek: 0 },
        { dayOfWeek: 8 },
        { dayOfWeek: 1.5 },
        { startTime: '24:00' },
        { startTime: '09:60' },
        { endTime: '08:00' },
        { endTime: '09:00:00' },
        { startTime: '09:00:00.1', endTime: '10:00:00.1' },
        { id: 5 },
        { studentId: undefined },
    ])('rejects invalid creation data %j', (override) => {
        expect(
            studentAvailabilitySchema.safeParse({ ...data, ...override })
                .success,
        ).toBe(false);
    });

    it('accepts times in HH:mm format', () => {
        expect(
            studentAvailabilitySchema.safeParse({
                ...data,
                startTime: '09:30',
                endTime: '10:45',
            }).success,
        ).toBe(true);
    });

    it('accepts a partial update', () => {
        expect(studentAvailabilityUpdateSchema.parse({ dayOfWeek: 7 })).toEqual(
            { dayOfWeek: 7 },
        );
    });

    it.each([
        {},
        { dayOfWeek: undefined },
        { studentId: 3 },
        { startTime: '12:00', endTime: '10:00' },
    ])('rejects invalid update %j', (data) => {
        expect(studentAvailabilityUpdateSchema.safeParse(data).success).toBe(
            false,
        );
    });
});
