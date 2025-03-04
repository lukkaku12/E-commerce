import { Service } from '../../services/entities/service.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ServiceSchedule {
  @PrimaryGeneratedColumn()
  schedule_id: number;

  @ManyToOne(() => Service, (service) => service.serviceSchedule)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  ending_time: string;

  @Column({ type: 'date' })
  schedule_date: Date;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean; // Campo para verificar disponibilidad

  @OneToMany(() => Transaction, (transaction) => transaction.schedule)
  transactions: Transaction[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
