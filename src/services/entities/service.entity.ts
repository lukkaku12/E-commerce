import { ServiceSchedule } from 'src/service-schedule/entities/service-schedule.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('datetime')
  created_at: Date;

  @Column('datetime')
  updated_at: Date;

  @OneToMany(
    () => ServiceSchedule,
    (serviceSchedule) => serviceSchedule.service,
  )
  serviceSchedule: ServiceSchedule[];
}
