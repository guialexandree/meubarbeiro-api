import crypto from 'node:crypto'
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm'
import { Sms } from '../../sms/entities'

export enum RegistrationStatus {
  Pending = 'pending',
  Activated = 'ativated',
}

export enum SMSStatus {
  Pending = 'pending',
  Sending = 'sending',
  Error = 'error',
}

@Entity('registrations')
export class Registration {
  @PrimaryColumn()
  id: string

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  @Column({ name: 'contact_number' })
  contactNumber: string

  @Column()
  code: string

  @Column({ type: 'simple-enum', name: 'sms_status' })
  smsStatus: SMSStatus

  @OneToMany(() => Sms, (sms) => sms)
  @JoinColumn()
  sms: Sms

  @Column({ type: 'simple-enum' })
  status: RegistrationStatus

  generateCode() {
    const randomBytes = crypto.randomBytes(2)
    const code = randomBytes.readUInt16BE(0) % 10000
    return code.toString().padStart(6, '0')
  }

  getMessageCode() {
    return `BARBEARIA: codigo de ativacao ${this.code}`
  }

  constructor(
    props: {
      contactNumber: string
      createdAt: Date
    },
    id?: string,
  ) {
    this.code = this.generateCode()
    this.status = RegistrationStatus.Pending
    this.smsStatus = SMSStatus.Pending
    Object.assign(this, props)
    this.id = id || crypto.randomUUID()
  }
}
