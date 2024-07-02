import { Test } from '@nestjs/testing';
import { AccountController } from '../account.controller';
import { AccountService } from '../account.service';
import { AccountRepository } from '../account.repository';
import { MockAccountRepository } from './mocks/mock.account.repository';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;
  let repository: AccountRepository;

  let controllerFindAllSpy: jest.SpyInstance;
  let controllerFindOneSpy: jest.SpyInstance;
  let controllerCreateSpy: jest.SpyInstance;
  let controllerUpdateSpy: jest.SpyInstance;
  let controllerRemoveSpy: jest.SpyInstance;

  let serviceFindAllSpy: jest.SpyInstance;
  let serviceFindOneSpy: jest.SpyInstance;
  let serviceCreateSpy: jest.SpyInstance;
  let serviceUpdateSpy: jest.SpyInstance;
  let serviceRemoveSpy: jest.SpyInstance;

  let repositoryFindAllSpy: jest.SpyInstance;
  let repositoryGetOneByIDSpy: jest.SpyInstance;
  let repositoryCreateSpy: jest.SpyInstance;
  let repositoryGetFirstByNameSpy: jest.SpyInstance;
  let repositoryUpdateSpy: jest.SpyInstance;
  let repositoryDeleteSpy: jest.SpyInstance;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        AccountService,
        {
          provide: AccountRepository,
          useClass: MockAccountRepository
        },
      ],
    }).compile();

    controller = moduleRef.get<AccountController>(AccountController);
    service = moduleRef.get<AccountService>(AccountService);
    repository = moduleRef.get<AccountRepository>(AccountRepository);

    controllerFindAllSpy = jest.spyOn(controller, 'findAll');
    controllerFindOneSpy = jest.spyOn(controller, 'findOne');
    controllerCreateSpy = jest.spyOn(controller, 'create');
    controllerUpdateSpy = jest.spyOn(controller, 'update');
    controllerRemoveSpy = jest.spyOn(controller, 'remove');

    serviceFindAllSpy = jest.spyOn(service, 'findAll');
    serviceFindOneSpy = jest.spyOn(service, 'findOne');
    serviceCreateSpy = jest.spyOn(service, 'create');
    serviceUpdateSpy = jest.spyOn(service, 'update');
    serviceRemoveSpy = jest.spyOn(service, 'remove');

    repositoryFindAllSpy = jest.spyOn(repository, 'getAll');
    repositoryGetOneByIDSpy = jest.spyOn(repository, 'getOneByID');
    repositoryCreateSpy = jest.spyOn(repository, 'create');
    repositoryGetFirstByNameSpy = jest.spyOn(repository, 'getFirstByName');
    repositoryUpdateSpy = jest.spyOn(repository, 'update');
    repositoryDeleteSpy = jest.spyOn(repository, 'delete');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('Should list all accounts', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      { id: 1, name: 'Account 1', type: 'savings', openingBalance: 1000 },
      { id: 2, name: 'Account 2', type: 'checkingAccount', openingBalance: 500 },
    ]);
    expect(controllerFindAllSpy).toHaveBeenCalled();
    expect(serviceFindAllSpy).toHaveBeenCalled();
    expect(repositoryFindAllSpy).toHaveBeenCalled();
  })

  it('Should return an account', async () => {
    const result = await controller.findOne('1');
    expect(controllerFindOneSpy).toHaveBeenCalled();
    expect(serviceFindOneSpy).toHaveBeenCalled();
    expect(repositoryGetOneByIDSpy).toHaveBeenCalled();
    expect(result).toEqual({
      id: 1,
      name: 'Account 1',
      type: 'savings',
      openingBalance: 1000
    });
  })

  it('Should return account not found error', async () => {
    try {
      await controller.findOne('101');
    } catch (error) {
      expect(controllerFindOneSpy).toHaveBeenCalled();
      expect(serviceFindOneSpy).toHaveBeenCalled();
      expect(repositoryGetOneByIDSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.status).toBe(404)
      expect(error.response.message).toBe("Conta não encontrada")
    }
  })

  it('Must create an account', async () => {
    const result = await controller.create({
      name: 'Test Account',
      type: "savings",
      openingBalance: 5000,
    });

    expect(controllerCreateSpy).toHaveBeenCalled();
    expect(serviceCreateSpy).toHaveBeenCalled();
    expect(repositoryCreateSpy).toHaveBeenCalled();
    expect(result).toEqual({
      id: 3,
      name: 'Test Account',
      type: 'savings',
      openingBalance: 5000
    });
  })

  it('Should return existing name error', async () => {
    try {
      await controller.create({
        name: 'Account 1',
        type: "savings",
        openingBalance: 5000,
      });
    } catch (error) {
      expect(controllerCreateSpy).toHaveBeenCalled();
      expect(serviceCreateSpy).toHaveBeenCalled();
      expect(repositoryGetFirstByNameSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.status).toBe(409)
      expect(error.response.message).toBe("Já existe uma conta com este nome.")
    }
  })

  it('Must return openingBalance error less than zero', async () => {
    try {
      await controller.create({
        name: 'Account 1000',
        type: "savings",
        openingBalance: -5000,
      });
    } catch (error) {
      expect(controllerCreateSpy).toHaveBeenCalled();
      expect(serviceCreateSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.status).toBe(400)
      expect(error.response.message).toBe("O saldo não pode ser menor que 0.")
    }
  })

  it('Should return invalid account type error', async () => {
    try {
      await controller.create({
        name: 'Account 1000',
        type: "poupanca",
        openingBalance: 5000,
      });
    } catch (error) {
      expect(controllerCreateSpy).toHaveBeenCalled();
      expect(serviceCreateSpy).toHaveBeenCalled();
      expect(repositoryGetFirstByNameSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.status).toBe(400)
      expect(error.response.message).toBe(
        "O tipo da conta deve ser \"savings\" para conta poupança ou \"checkingAccount\" para conta corrente)."
      )
    }
  })

  it('Must update an account', async () => {
    const result = await controller.update('1', {
      name: 'Test Update Account',
    });
    expect(controllerUpdateSpy).toHaveBeenCalled();
    expect(serviceUpdateSpy).toHaveBeenCalled();
    expect(repositoryGetOneByIDSpy).toHaveBeenCalled();
    expect(repositoryGetFirstByNameSpy).toHaveBeenCalled();
    expect(repositoryUpdateSpy).toHaveBeenCalled();
    expect(result).toEqual({
      id: 1,
      name: 'Test Update Account',
      type: 'savings',
      openingBalance: 5000
    });
  })

  it('Should return account not found error', async () => {
    try {
      await controller.update('101', {
        name: 'Account 1',
      });
    } catch (error) {
      expect(controllerUpdateSpy).toHaveBeenCalled();
      expect(serviceUpdateSpy).toHaveBeenCalled();
      expect(repositoryGetOneByIDSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.status).toBe(404)
      expect(error.response.message).toBe("Conta não encontrada")
    }
  })

  it('Should return existing name error', async () => {
    try {
      await controller.update('2', {
        name: 'Account 1',
      });
    } catch (error) {
      expect(controllerUpdateSpy).toHaveBeenCalled();
      expect(serviceUpdateSpy).toHaveBeenCalled();
      expect(repositoryGetOneByIDSpy).toHaveBeenCalled();
      expect(repositoryGetFirstByNameSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.status).toBe(409)
      expect(error.response.message).toBe("Já existe uma conta com este nome.")
    }
  })

  it('Must delete an account', async () => {
    const result = await controller.remove('1');
    expect(controllerRemoveSpy).toHaveBeenCalled();
    expect(serviceRemoveSpy).toHaveBeenCalled();
    expect(repositoryGetOneByIDSpy).toHaveBeenCalled();
    expect(repositoryDeleteSpy).toHaveBeenCalled();
    expect(result).toEqual({
      id: 1,
      name: 'Account 1',
      type: 'savings',
      openingBalance: 1000
    });
  })

  it('Should return account not found error', async () => {
    try {
      await controller.remove('101');
    } catch (error) {
      expect(controllerRemoveSpy).toHaveBeenCalled();
      expect(serviceRemoveSpy).toHaveBeenCalled();
      expect(repositoryGetOneByIDSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.status).toBe(404)
      expect(error.response.message).toBe("Conta não encontrada")
    }
  })
});
