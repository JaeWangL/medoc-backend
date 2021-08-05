import DayJS from 'dayjs';
import { Kind, ValueNode } from 'graphql';
import { CustomScalar, Scalar } from '@nestjs/graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  parseValue(value: string): Date {
    return new Date(value); // value from the client
  }

  serialize(value: Date): string {
    return DayJS(value).utc().format('YYYY-MM-DD HH:mm:ss'); // value sent to the client
  }

  parseLiteral(ast: ValueNode): Date | null {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }

    return null;
  }
}
