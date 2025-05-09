import { Inject, Injectable } from '@nestjs/common'
import { IAttendancesRepository } from '../attendances.repository'
import { InvalidRuleException } from '../../../domain/errors'
import { AttendanceStatus } from '../entities/attendance.entity'
import { IDateAdapter } from '../../../infra/adapters/protocols'

@Injectable()
export class EndAttendanceUseCase {
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

    if (attendance.status !== 'attending') {
      throw new InvalidRuleException('O atendimento já foi finalizado')
    }

    attendance.status = 'finished'
    attendance.finishedAt = this.dateAdapter.now()
    await this.attendancesRepository.save(attendance)

    return attendance
  }
}
