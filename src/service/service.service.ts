import { Injectable, NotFoundException } from '@nestjs/common';
import CreateServiceDto from './dto/create-service.dto';
import UpdateServiceDto from './dto/update-service.dto';
import { FindAllService } from './dto/search.dto';
import IQueryDTO from './dto/query.dto';
import Service from './entities/service.entity';
import { serviceNotFound } from '../utils/constants/errorMessages';
import ServiceRepository from './repository/implementation/ServiceRepository';
import MechanicRepository from '../mechanic/repository/implementation/MechanicRepository';
import BikeRepository from '../bike/repository/implementation/BikeRepository';

@Injectable()
export default class ServiceService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly bikeRepository: BikeRepository,
    private readonly mechanicRepository: MechanicRepository
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const { storeId, mechanicId, bikeId, clientId } = createServiceDto;
    const responseMechanic = await this.mechanicRepository.findOne({ where: { storeId, mechanicId } });
    if (!responseMechanic && !responseMechanic?.isActive) {
      throw new NotFoundException('Store or Mechanic Not Found');
    }

    const responseBike = await this.bikeRepository.findOne({ where: { bikeId, clientId } });
    if (!responseBike && !responseBike?.isActive) {
      throw new NotFoundException('Client or Bike Not Found');
    }
    const part = await this.serviceRepository.create({ ...createServiceDto, isActive: true });

    return part;
  }

  async findAll(query?: IQueryDTO): Promise<FindAllService> {
    const { limit, offset, ...where } = query;
    const response = await this.serviceRepository.findAll({ limit, offset, where });
    return { totalResults: response[1], items: response[0], limit: query.limit || 20, offset: query.offset || 0 };
  }

  async findOne(serviceId: string): Promise<Service> {
    const response = await this.serviceRepository.findOne({ where: { serviceId } });
    if (!response) {
      throw new NotFoundException(serviceNotFound);
    }
    return response;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const response = await this.serviceRepository.update(id, updateServiceDto);
    if (!response || response === 0) {
      throw new NotFoundException(serviceNotFound);
    }
  }

  async remove(id: string): Promise<void> {
    const response = await this.serviceRepository.setIsActive(id, false);
    if (!response || response === 0) {
      throw new NotFoundException(serviceNotFound);
    }
  }
}
