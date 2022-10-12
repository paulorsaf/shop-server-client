import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindOrganizationByIdQuery } from './queries/find-organization-by-id.query';

@Controller('organizations')
export class OrganizationController {

  constructor(
    private queryBus: QueryBus
  ){}

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.queryBus.execute(
      new FindOrganizationByIdQuery(id)
    )
  }

}