import { Inject, Injectable } from '@nestjs/common'
import { IServicesRepository } from '../services.repository'
import { CreateServiceDto } from '../dto/create-service.dto'
import { Service, ServiceStatus } from '../entities/service.entity'
import { IDateAdapter } from '../../../infra/adapters/protocols'
import { InvalidRuleException } from 'src/domain/errors/invalid-rule-exception'

@Injectable()
export class CreateServiceUseCase {
  constructor(
    @Inject('IServicesRepository')
    private readonly servicesRepository: IServicesRepository,
    @Inject('IDateAdapter')
    private readonly dateAdapter: IDateAdapter,
  ) {}

  async execute(input: CreateServiceDto) {
    const hasService = await this.servicesRepository.findByName(input.name.toLowerCase())
    if (hasService) {
      throw new InvalidRuleException('Já existe um serviço com esse nome')
    }

    const serviceParams = {
      ...input,
      name: input.name.trim().toLowerCase(),
      description: input.description?.trim()?.toLowerCase(),
      createdAt: this.dateAdapter.now(),
      updatedAt: this.dateAdapter.now(),
      status: 'active' as ServiceStatus,
    }

    const service = new Service(serviceParams)
    return this.servicesRepository.save(service)
  }
}
