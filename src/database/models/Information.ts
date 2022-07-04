import {
  Table,
  Column,
  DataType,
  IsEmail,
  Model,
  AutoIncrement,
  PrimaryKey
} from "sequelize-typescript";

@Table({
  tableName: "informations",
})
export class Information extends Model {

  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  public id!: number;

  @Column({ type: DataType.STRING })
  public name!: string;

  @IsEmail
  @Column({ type: DataType.STRING })
  public email!: string;

  @Column({ type: DataType.STRING })
  public phone_no!: string;

  @Column({ type: DataType.STRING })
  public work!: string;

  @Column({ type: DataType.STRING })
  public company!: string;

  @Column({ type: DataType.STRING })
  public location!: string;
}
