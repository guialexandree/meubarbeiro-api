import { Module } from '@nestjs/common'
import { AlertsService } from './alerts.service'
import { AlertsController } from './alerts.controller'
import { SeedAlertsUseCase } from './usecases/seed-alerts-use-case'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Alert } from './entities/alert.entity'
import { CompaniesModule } from '../companies/companies.module'
import { DateAdapterModule } from '../../infra/adapters/date-adapter/dayjs-adapter/date-adapter.module'
import { GetAllAlertsUseCase } from './usecases/get-all-alerts-use-case'
import { CreateAlertUseCase } from './usecases/create-alert-use-case'
import { UpdateAlertUseCase } from './usecases/update-alert-use-case'
import { RemoveAlertUseCase } from './usecases/remove-alert-use-case'
import { AlertsRepository } from './alerts.repository'

@Module({
  imports: [
    DateAdapterModule,
    TypeOrmModule.forFeature([Alert]),
  ],
  controllers: [AlertsController],
  providers: [
    AlertsService,
    SeedAlertsUseCase,
    GetAllAlertsUseCase,
    CreateAlertUseCase,
    UpdateAlertUseCase,
    RemoveAlertUseCase,
    AlertsRepository,
    {
      provide: 'IAlertsRepository',
      useExisting: AlertsRepository,
    },
  ],
  exports: [
    AlertsService,
    {
      provide: 'IAlertsRepository',
      useExisting: AlertsRepository,
    },
  ],
})
export class AlertsModule {}
