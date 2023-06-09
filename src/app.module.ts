import { Module } from '@nestjs/common';
import AuthModule from './auth/auth.module';
import StoreModule from './store/store.module';
import ClientModule from './client/client.module';
import ServiceModule from './service/service.module';
import FeedbackModule from './feedback/feedback.module';
import DatabaseModule from './database/database.module';
import BikeModule from './bike/bike.module';
import PartModule from './part/part.module';
import MechanicModule from './mechanic/mechanic.module';

@Module({
  imports: [
    StoreModule,
    ClientModule,
    BikeModule,
    ServiceModule,
    FeedbackModule,
    DatabaseModule,
    PartModule,
    MechanicModule,
    AuthModule
  ],
  controllers: []
})
export default class AppModule {}
