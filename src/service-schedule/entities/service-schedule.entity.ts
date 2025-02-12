import { Service } from 'src/services/entities/service.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ServiceSchedule {
  @PrimaryGeneratedColumn()
  schedule_id: number;

  @ManyToOne(() => Service, (service) => service.serviceSchedule)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ type: 'time' })
  start_time: string; // Solo hora (ej: '08:00')

  @Column({ type: 'time' })
  ending_time: string; // Solo hora (ej: '09:30')

  @Column({ type: 'date' })
  schedule_date: Date; // Fecha completa (ej: '2024-09-08')

  @Column()
  isAvailable: boolean;
}
