

import { Country } from "src/countries/entities/country.entity";
import { Role } from "src/roles/entities/role.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";




@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    fullName: string

    @Column({ name: 'countryCode' })
    countryCode: string;

    @Column()
    dialCode: string; // Ej: +57

    @Column( 'text',{ unique: true })
    phone: string;

    @Column('bool',{ default: false })
    isPhoneVerified: boolean;

    @Column('text', { unique: true })
    email: string;

    @Column('text', { select: false })
    password: string;

    @Column('text', { nullable: true })
    image?: string;

    @Column({ default: true })
    isActive: boolean;

    @Column('text', { nullable: true })
    notification_token: string;

    @ManyToOne(() => Country, { eager: false }) // Lazy si usas GraphQL o necesitas rendimiento
    @JoinColumn({ name: 'countryCode', referencedColumnName: 'countryCode' })
    country: Country;

    @JoinTable({
        name: 'user_has_roles',
        joinColumn: {
            name: 'id_user'
        },
        inverseJoinColumn: {
            name: 'id_rol'
        }
    })


    @ManyToMany(() => Role, (role) => role.users)
    roles: Role[];


    // Si es DRIVER y pertenece a una AGENCY
    @ManyToOne(() => User, { nullable: true })
    agency?: User;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    updated_at: Date;


    // async hashPassword(password: string) {
    //     // Lógica para hashear la contraseña antes de guardarla
    //     this.password = await hash(password, 10);
    // }

}
