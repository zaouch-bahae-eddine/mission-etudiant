import {
    studentProfileSchema,
    studentProfileUpdateSchema,
} from '../dto/student-profile.dto.js';

describe('Student profile DTOs', () => {
    it('requires only the user ID for creation', () => {
        expect(studentProfileSchema.parse({ userId: 12 })).toEqual({
            userId: 12,
        });
    });

    it('accepts nullable fields and valid numeric values', () => {
        const data = {
            userId: 12,
            bio: null,
            hasVehicle: false,
            travel_radius_km: 0,
            hourly_rate: 12.5,
        };
        expect(studentProfileSchema.parse(data)).toEqual(data);
    });

    it.each([
        { userId: 0 },
        { userId: 1.5 },
        { userId: undefined },
        { travel_radius_km: -1 },
        { travel_radius_km: 1.5 },
        { hourly_rate: -1 },
        { hourly_rate: 12.345 },
        { hourly_rate: 100000000 },
        { university: 'a'.repeat(256) },
        { studentLevel: 'a'.repeat(101) },
        { hasVehicle: 'true' },
        { studentVerifiedAt: new Date() },
        { id: 1 },
    ])('rejects invalid creation data %j', (override) => {
        expect(
            studentProfileSchema.safeParse({ userId: 12, ...override }).success,
        ).toBe(false);
    });

    it('allows clearing a field in a partial update', () => {
        expect(studentProfileUpdateSchema.parse({ userId: 1, bio: null })).toEqual({
            userId: 1,
            bio: null,
        });
    });
    // il faut modfier le type de  studentProfileUpdateSchema pour qu'il ne permet plus la modification de ces champ
    it.each([
        {},
        { bio: undefined },
        { userId: 3 },
        { studentVerifiedAt: new Date() },
    ])('rejects invalid update %j', (data) => {
        expect(studentProfileUpdateSchema.safeParse(data).success).toBe(false);
    });
});
