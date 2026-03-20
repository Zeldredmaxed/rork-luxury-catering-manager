import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MenuService } from './menu.service';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'Get all menu items with optional filters' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'featured', required: false, type: Boolean })
  @ApiQuery({ name: 'popular', required: false, type: Boolean })
  findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('featured') featured?: string,
    @Query('popular') popular?: string,
  ) {
    return this.menuService.findAll({
      category,
      search,
      featured: featured === 'true',
      popular: popular === 'true',
    });
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get menu categories' })
  getCategories() {
    return this.menuService.getCategories();
  }

  @Get('promotions')
  @ApiOperation({ summary: 'Get active promotions' })
  getPromotions() {
    return this.menuService.getPromotions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single menu item' })
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a menu item (admin)' })
  create(@Body() body: any) {
    return this.menuService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a menu item (admin)' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.menuService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft-delete a menu item (admin)' })
  delete(@Param('id') id: string) {
    return this.menuService.delete(id);
  }
}
