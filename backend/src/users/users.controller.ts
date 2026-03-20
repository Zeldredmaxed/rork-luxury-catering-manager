import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.sub);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(@Request() req, @Body() body: {
    name?: string;
    phone?: string;
    avatar?: string;
    dietaryPreferences?: string[];
    allergies?: string[];
  }) {
    return this.usersService.updateProfile(req.user.sub, body);
  }

  @Post('me/addresses')
  @ApiOperation({ summary: 'Add a new address' })
  addAddress(@Request() req, @Body() body: {
    label: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    isDefault?: boolean;
  }) {
    return this.usersService.addAddress(req.user.sub, body);
  }

  @Patch('me/addresses/:id')
  @ApiOperation({ summary: 'Update an address' })
  updateAddress(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.usersService.updateAddress(req.user.sub, id, body);
  }

  @Delete('me/addresses/:id')
  @ApiOperation({ summary: 'Delete an address' })
  deleteAddress(@Param('id') id: string) {
    return this.usersService.deleteAddress(id);
  }

  @Post('me/favorites/:menuItemId')
  @ApiOperation({ summary: 'Toggle favorite on a menu item' })
  toggleFavorite(@Request() req, @Param('menuItemId') menuItemId: string) {
    return this.usersService.toggleFavorite(req.user.sub, menuItemId);
  }

  @Get('me/favorites')
  @ApiOperation({ summary: 'Get user favorites' })
  getFavorites(@Request() req) {
    return this.usersService.getFavorites(req.user.sub);
  }
}
