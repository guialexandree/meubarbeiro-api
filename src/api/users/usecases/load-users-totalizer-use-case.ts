import { Inject, Injectable } from '@nestjs/common'
import { IUsersRepository } from '../users.repository'
import { LoadUsersTotalizerDto } from '../dto/load-users-totalizer.dto'
import { IDateAdapter } from '../../../infra/adapters/protocols'

@Injectable()
export class LoadUsersTotalizerUseCase {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
    @Inject('IDateAdapter')
    private readonly dateAdapter: IDateAdapter,
  ) {}

  async execute(): Promise<LoadUsersTotalizerDto> {
    const total = await this.usersRepository.count()

    const startDate = this.dateAdapter.daysAgo(30)
    const newUsers = await this.usersRepository.countStartDate(startDate)

    const lastMonth = this.dateAdapter.daysAgo(60)
    const newUsersLastMonth = await this.usersRepository.countStartDate(lastMonth)
    let totalNewUsersLastMonth = newUsersLastMonth - newUsers
    totalNewUsersLastMonth = totalNewUsersLastMonth === 0 ? 1 : totalNewUsersLastMonth
    const growth = (newUsers / totalNewUsersLastMonth) * 100

    return {
      total,
      new: newUsers,
      growth
    }
  }
}

