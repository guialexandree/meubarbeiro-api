import { Module } from '@nestjs/common'
import { SmsService } from './sms.service'
import { SmsRepository } from './sms.repository'
import { SendSmsUseCase } from './usecases/send-sms-use-case'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Sms } from './entities/sms.entity'
import { SmsProviderModule } from '../../infra/adapters/sms-adapter'

@Module({
  imports: [
    SmsProviderModule,
    TypeOrmModule.forFeature([Sms]),
  ],
  providers: [
    SmsService,
    SendSmsUseCase,
    SmsRepository,
    {
      provide: 'ISmsRepository',
      useExisting: SmsRepository,
    },
  ],
  exports: [SmsService],
})
export class SmsModule {}
