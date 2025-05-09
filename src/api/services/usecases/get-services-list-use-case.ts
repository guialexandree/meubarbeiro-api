import { Inject, Injectable } from '@nestjs/common'
import { IServicesRepository } from '../services.repository'
import { AlertsService } from '../../alerts/alerts.service'
import { AlertType } from '../../alerts/entities/alert.entity'

@Injectable()
export class GetServicesListUseCase {
  constructor(
    @Inject('IServicesRepository')
    private readonly serviceRepository: IServicesRepository,
    @Inject()
    private readonly alertService: AlertsService,
  ) {}

  async execute() {
    const services = await this.serviceRepository.findAll()
    const servicesAvailables = services.filter(
      (service) => service.status === 'actived',
    )
    const alerts = (await this.alertService.findAll())
      .filter((alert) => alert.type === AlertType.Servicos)
      .map((alert) => alert.message)

    return {
      services: servicesAvailables,
      alerts,
    }
  }
}
