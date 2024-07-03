import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PaymentService } from '../payment.service';
import { PaymentController } from '../payment.controller';
import { PaymentRepository } from '../payment.repository';
import { MockPaymentRepository } from './mocks/mock.payment.repository';
import { AccountRepository } from '../../account/account.repository';
import { MockAccountRepository } from '../../account/test/mocks/mock.account.repository';

describe('PaymentService', () => {
  let controller: PaymentController;
  let service: PaymentService;
  let repository: PaymentRepository;
  let accountRepository: AccountRepository;

  let controllerFindAllSpy: jest.SpyInstance;
  let controllerFindOneSpy: jest.SpyInstance;
  let controllerCreateSpy: jest.SpyInstance;

  let serviceFindAllSpy: jest.SpyInstance;
  let serviceFindOneSpy: jest.SpyInstance;
  let serviceCreateSpy: jest.SpyInstance;
  let serviceGetAccountBalanceSpy: jest.SpyInstance;

  let repositoryGetAllSpy: jest.SpyInstance;
  let repositoryGetAllByAccountSpy: jest.SpyInstance;
  let repositoryGetOneByIDSpy: jest.SpyInstance;
  let repositoryGetFirstByDescriptionSpy: jest.SpyInstance;
  let repositoryCreateSpy: jest.SpyInstance;

  let accountRepositoryGetOneByIDSpy: jest.SpyInstance;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        PaymentService,
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

    controller = moduleRef.get<PaymentController>(PaymentController);
    service = moduleRef.get<PaymentService>(PaymentService);
    repository = moduleRef.get<PaymentRepository>(PaymentRepository);
    accountRepository = moduleRef.get<AccountRepository>(AccountRepository);

    controllerFindAllSpy = jest.spyOn(controller, 'findAll');
    controllerFindOneSpy = jest.spyOn(controller, 'findOne');
    controllerCreateSpy = jest.spyOn(controller, 'create');

    serviceFindAllSpy = jest.spyOn(service, 'findAll');
    serviceFindOneSpy = jest.spyOn(service, 'findOne');
    serviceCreateSpy = jest.spyOn(service, 'create');
    serviceGetAccountBalanceSpy = jest.spyOn(service, 'getAccountBalance');

    repositoryGetAllSpy = jest.spyOn(repository, 'getAll');
    repositoryGetAllByAccountSpy = jest.spyOn(repository, 'getAllByAccount');
    repositoryGetOneByIDSpy = jest.spyOn(repository, 'getOneByID');
    repositoryGetFirstByDescriptionSpy = jest.spyOn(
      repository,
      'getFirstByDescription',
    );
    repositoryCreateSpy = jest.spyOn(repository, 'create');

    accountRepositoryGetOneByIDSpy = jest.spyOn(
      accountRepository,
      'getOneByID',
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('Should list all payments', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      {
        id: 1,
        accountId: 1,
        value: 500,
        date: new Date(2024, 6, 2, 21, 0, 0),
        description: 'Payment Test 1',
      },
      {
        id: 2,
        accountId: 2,
        value: 500,
        date: new Date(2024, 6, 2, 21, 0, 0),
        description: 'Payment Test 2',
      },
    ]);
    expect(controllerFindAllSpy).toHaveBeenCalled();
    expect(serviceFindAllSpy).toHaveBeenCalled();
    expect(repositoryGetAllSpy).toHaveBeenCalled();
  });

  it('Should list all payments by id 1', async () => {
    const result = await controller.findAll({ accountId: '1' });
    expect(result).toEqual([
      {
        id: 1,
        accountId: 1,
        value: 500,
        date: new Date(2024, 6, 2, 21, 0, 0),
        description: 'Payment Test 1',
      },
    ]);
    expect(controllerFindAllSpy).toHaveBeenCalled();
    expect(serviceFindAllSpy).toHaveBeenCalled();
    expect(accountRepositoryGetOneByIDSpy).toHaveBeenCalled();
    expect(repositoryGetAllByAccountSpy).toHaveBeenCalled();
  });

  it('Should return accountId not found error', async () => {
    try {
      await controller.findAll({ accountId: '3' });
    } catch (error) {
      expect(controllerFindAllSpy).toHaveBeenCalled();
      expect(serviceFindAllSpy).toHaveBeenCalled();
      expect(accountRepositoryGetOneByIDSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.status).toBe(404);
      expect(error.response.message).toBe('Conta não encontrada');
    }
  });

  it('Should return an payment', async () => {
    const result = await controller.findOne('1');
    expect(controllerFindOneSpy).toHaveBeenCalled();
    expect(serviceFindOneSpy).toHaveBeenCalled();
    expect(repositoryGetOneByIDSpy).toHaveBeenCalled();
    expect(result).toEqual({
      id: 1,
      accountId: 1,
      value: 500,
      date: new Date(2024, 6, 2, 21, 0, 0),
      description: 'Payment Test 1',
    });
  });

  it('Should return payment not found error', async () => {
    try {
      await controller.findOne('101');
    } catch (error) {
      expect(controllerFindOneSpy).toHaveBeenCalled();
      expect(serviceFindOneSpy).toHaveBeenCalled();
      expect(repositoryGetOneByIDSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.status).toBe(404);
      expect(error.response.message).toBe('Transação não encontrada');
    }
  });

  it('Must create an payment', async () => {
    const result = await controller.create({
      accountId: 1,
      value: 50,
      date: new Date(2024, 6, 2, 21, 0, 0),
      description: 'Create Payment Test 1',
    });
    expect(controllerCreateSpy).toHaveBeenCalled();
    expect(serviceCreateSpy).toHaveBeenCalled();
    expect(accountRepositoryGetOneByIDSpy).toHaveBeenCalled();
    expect(repositoryGetFirstByDescriptionSpy).toHaveBeenCalled();
    expect(serviceGetAccountBalanceSpy).toHaveBeenCalled();
    expect(repositoryCreateSpy).toHaveBeenCalled();
    expect(result).toEqual({
      id: 3,
      accountId: 1,
      value: 50,
      date: new Date(2024, 6, 2, 21, 0, 0),
      description: 'Create Payment Test 1',
    });
  });

  it('Should return error account not found', async () => {
    try {
      await controller.create({
        accountId: 1,
        value: 50,
        date: new Date(2024, 6, 2, 21, 0, 0),
        description: 'Create Payment Test 1',
      });
    } catch (error) {
      expect(controllerCreateSpy).toHaveBeenCalled();
      expect(serviceCreateSpy).toHaveBeenCalled();
      expect(accountRepositoryGetOneByIDSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.status).toBe(409);
      expect(error.response.message).toBe(
        'A conta informada não foi encontrada',
      );
    }
  });

  it('Should return error account not found', async () => {
    try {
      await controller.create({
        accountId: 1,
        value: 50,
        date: new Date(2024, 6, 2, 21, 0, 0),
        description: 'Payment Test 1',
      });
    } catch (error) {
      expect(controllerCreateSpy).toHaveBeenCalled();
      expect(serviceCreateSpy).toHaveBeenCalled();
      expect(accountRepositoryGetOneByIDSpy).toHaveBeenCalled();
      expect(repositoryGetFirstByDescriptionSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.status).toBe(409);
      expect(error.response.message).toBe(
        'Já existe um pagamento com essa descrição para esta conta',
      );
    }
  });

  it('Should return error account not found', async () => {
    try {
      await controller.create({
        accountId: 1,
        value: 501,
        date: new Date(2024, 6, 2, 21, 0, 0),
        description: 'Payment Test 2',
      });
    } catch (error) {
      expect(controllerCreateSpy).toHaveBeenCalled();
      expect(serviceCreateSpy).toHaveBeenCalled();
      expect(accountRepositoryGetOneByIDSpy).toHaveBeenCalled();
      expect(repositoryGetFirstByDescriptionSpy).toHaveBeenCalled();
      expect(serviceGetAccountBalanceSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.status).toBe(400);
      expect(error.response.message).toBe(
        'Saldo insuficiente para realizar o pagamento',
      );
    }
  });
});
