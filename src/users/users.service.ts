import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto){
    const {name, email, password, phone, acceptedTerms} = createUserDto;
    if (!name || !email || !password)
      throw new BadRequestException('Name, email, and password are required');
    if (!acceptedTerms)
      throw new BadRequestException('You must accept the terms and conditions');

     const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password))
      throw new BadRequestException(
        'Password must be at least 6 characters and include letters and numbers',
      );

       if (phone) {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(phone))
        throw new BadRequestException('Phone number must be 10-15 digits');
    }

  } {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
