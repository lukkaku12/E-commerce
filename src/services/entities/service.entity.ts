import { ServiceSchedule } from 'src/service-schedule/entities/service-schedule.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  service_id: number;

  @Column()
  service_name: string;

  @Column()
  service_description: string;

  @Column()
  service_price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.service)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @OneToMany(
    () => ServiceSchedule,
    (serviceSchedule) => serviceSchedule.service,
  )
  serviceSchedule: ServiceSchedule[];
}
