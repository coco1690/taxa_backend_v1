import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string; // 'CLIENT', 'DRIVER', 'AGENCY', 'ADMIN'

  @ManyToMany( () => User, (user) => user.roles,  ) // { eager:true } carga automaticamente la relacion 
  users : User[];
}
