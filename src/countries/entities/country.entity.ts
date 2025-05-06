import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  countryCode: string; // Ej: "CO"   

  @Column()
  name: string; // Ej: "Colombia"

  @Column( {nullable:true} )
  dialCode: string; // Ej: "+57"

  @OneToMany(() => User, (user) => user.country)
  users: User[];
}  
