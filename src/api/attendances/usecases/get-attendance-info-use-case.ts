import { Inject, Injectable } from '@nestjs/common'
import { IAttendancesRepository } from '../attendances.repository'
import { IDateAdapter } from '../../../infra/adapters/protocols'

@Injectable()
export class GetAttendanceInfoUseCase {
  constructor(
    @Inject('IAttendancesRepository')
    private readonly attendancesRepository: IAttendancesRepository,
    @Inject('IDateAdapter')
    private readonly dateAdapter: IDateAdapter,
  ) {}

  async execute() {
    const total = await this.attendancesRepository.countTodayByStatus('finished')
    const previsionTime = await this.attendancesRepository.totalServiceTime()
    const previsionDate = previsionTime
      ? this.dateAdapter.addMinutes(previsionTime)
      : null

    return {
      total,
      previsionTime,
      previsionDate,
    }
  }
}
