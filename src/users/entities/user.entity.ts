
import { Country } from "src/countries/entities/country.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";




@Entity({name:'users'})
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    fullName:string
    
    @Column()
    dialCode: string; // Ej: +57

    @Column({ unique: true })
    phone:string

    @Column({ default: false })
    isPhoneVerified: boolean;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column( 'text', { select:false, nullable:true } )
    password: string;

    @Column('text', { nullable: true })
    image: string;

    @Column({ default: true })
    isActive: boolean;  
    
    @Column('text', { nullable: true })
    notification_token: string;
        
    @ManyToOne(() => Country, { eager: false }) // Lazy si usas GraphQL o necesitas rendimiento
    @JoinColumn({ name: 'countryCode', referencedColumnName: 'countryCode' })
    country: Country;

     // Si es DRIVER y pertenece a una AGENCY
    @ManyToOne(() => User, { nullable: true })
    agency?: User;
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
    
    @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    updated_at: Date;
     
    
}
