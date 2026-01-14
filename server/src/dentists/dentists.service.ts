import { Injectable } from '@nestjs/common';

@Injectable()
export class DentistsService {
    // Mock Data for Phase 2 Demo
    private dentists = [
        {
            id: 'd1',
            name: 'Dr. Sarah Wilson',
            specialization: 'Orthodontist',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2670&auto=format&fit=crop',
            rating: 4.9,
            experience: '8 Years',
            schedule: ['Mon', 'Wed', 'Fri']
        },
        {
            id: 'd2',
            name: 'Dr. James Lee',
            specialization: 'Oral Surgeon',
            image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2864&auto=format&fit=crop',
            rating: 4.8,
            experience: '12 Years',
            schedule: ['Tue', 'Thu']
        },
        {
            id: 'd3',
            name: 'Dr. Emily Chen',
            specialization: 'Pediatric Dentist',
            image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2787&auto=format&fit=crop',
            rating: 5.0,
            experience: '5 Years',
            schedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        }
    ];

    findAll() {
        return this.dentists;
    }

    findOne(id: string) {
        return this.dentists.find(d => d.id === id);
    }
}
