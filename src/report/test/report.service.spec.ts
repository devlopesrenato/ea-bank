import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from '../report.service';
import { AccountService } from '../../account/account.service';
import { PaymentService } from '../../payment/payment.service';
import { MockAccountRepository } from '../../account/test/mocks/mock.account.repository';
import { AccountRepository } from '../../account/account.repository';
import { MockPaymentRepository } from '../../payment/test/mocks/mock.payment.repository';
import { PaymentRepository } from '../../payment/payment.repository';
import { ReportController } from '../report.controller';
import { ReportRepository } from '../report.repository';
import { MockReportRepository } from './mocks/mock.report.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReportService', () => {
  let controller: ReportController;
  let service: ReportService;
  let repository: ReportRepository;
  let accountService: AccountService;
  let paymentService: PaymentService;

  let controllerAccountStatementSpy: jest.SpyInstance;
  let repositoryGetPaymentsByAccountAndPeriodSpy: jest.SpyInstance;
  let serviceAccountStatementSpy: jest.SpyInstance;
  let accountServiceFindOneSpy: jest.SpyInstance;
  let paymentServiceGetAccountBalanceSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        ReportService,
        {
          provide: ReportRepository,
          useClass: MockReportRepository,
        },
        PaymentService,
        AccountService,
        {
          provide: PaymentRepository,
          useClass: MockPaymentRepository,
        },
        {
          provide: AccountRepository,
          useClass: MockAccountRepository,
        },
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    service = module.get<ReportService>(ReportService);
    repository = module.get<ReportRepository>(ReportRepository);
    accountService = module.get<AccountService>(AccountService);
    paymentService = module.get<PaymentService>(PaymentService);

    controllerAccountStatementSpy = jest.spyOn(controller, 'accountStatement');
    repositoryGetPaymentsByAccountAndPeriodSpy = jest.spyOn(
      repository,
      'getPaymentsByAccountAndPeriod',
    );
    serviceAccountStatementSpy = jest.spyOn(service, 'accountStatement');
    accountServiceFindOneSpy = jest.spyOn(accountService, 'findOne');
    paymentServiceGetAccountBalanceSpy = jest.spyOn(
      paymentService,
      'getAccountBalance',
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(accountService).toBeDefined();
    expect(paymentService).toBeDefined();
  });

  it('should get report account statement', async () => {
    const result = await controller.accountStatement({
      accountId: 1,
      dateStart: new Date(2024, 6, 1, 0, 0, 0),
      dateEnd: new Date(2024, 6, 30, 23, 59, 59),
    });
    expect(result).toEqual({
      id: 1,
      name: 'Account 1',
      type: 'savings',
      openingBalance: 1000,
      currentBalance: 500,
      totalPaymentsInThePeriod: 500,
      payments: [
        {
          id: 1,
          accountId: 1,
          value: 500,
          date: new Date(2024, 6, 2, 21, 0, 0),
          description: 'Payment Test 1',
        },
      ],
    });
    expect(controllerAccountStatementSpy).toHaveBeenCalled();
    expect(serviceAccountStatementSpy).toHaveBeenCalled();
    expect(repositoryGetPaymentsByAccountAndPeriodSpy).toHaveBeenCalled();
    expect(accountServiceFindOneSpy).toHaveBeenCalled();
    expect(accountServiceFindOneSpy).toHaveBeenCalled();
    expect(paymentServiceGetAccountBalanceSpy).toHaveBeenCalled();
  });

  it('should return error of end date less than start date', async () => {
    try {
      await controller.accountStatement({
        accountId: 1,
        dateStart: new Date(2024, 6, 1, 0, 0, 0),
        dateEnd: new Date(2024, 5, 30, 23, 59, 59),
      });
    } catch (error) {
      expect(controllerAccountStatementSpy).toHaveBeenCalled();
      expect(serviceAccountStatementSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.status).toBe(400);
      expect(error.response.message).toBe(
        'A data final não pode ser menor que a data inicial',
      );
    }
  });

  it('should return accountId not found error', async () => {
    try {
      await controller.accountStatement({
        accountId: 101,
        dateStart: new Date(2024, 6, 1, 0, 0, 0),
        dateEnd: new Date(2024, 6, 30, 23, 59, 59),
      });
    } catch (error) {
      expect(controllerAccountStatementSpy).toHaveBeenCalled();
      expect(serviceAccountStatementSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.status).toBe(404);
      expect(error.response.message).toBe('Conta não encontrada');
    }
  });
});
