import { Inject, Injectable } from '@nestjs/common'
import { IAttendancesRepository } from '../attendances.repository'
import { InvalidRuleException } from '../../../domain/errors'
import { IDateAdapter } from '../../../infra/adapters/protocols'

@Injectable()
export class StartAttendanceUseCase {
  constructor(
    @Inject('IAttendancesRepository')
    private readonly attendancesRepository: IAttendancesRepository,
    @Inject('IDateAdapter')
    private readonly dateAdapter: IDateAdapter,
  ) {}

  async execute(id: string) {
    const attendance = await this.attendancesRepository.findOne(id)
    if (!attendance) {
      throw new InvalidRuleException('O atendimento informado não existe')
    }

    attendance.status = 'attending'
    attendance.startedAt = this.dateAdapter.now()
    await this.attendancesRepository.save(attendance)

    return attendance
  }
}
