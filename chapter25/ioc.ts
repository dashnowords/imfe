// IOC成员属性
interface iIOCMember {
  factory: Function
  singleton: boolean;
  instance?: {}
}

// 构造函数类型
interface iClass<T> {
  new(...args: any[]): T
}

// 定义IOC容器
class IOC {

  private container: Map<PropertyKey, iIOCMember>;

  constructor() {
    this.container = new Map<string, iIOCMember>();
  }

  bind<T>(key: string, Fn: iClass<T>) {
    const factory = () => new Fn();
    this.container.set(key, { factory, singleton: true });
  }
  restore(key: string) {
    this.container.delete(key);
  }
  use(namespace: string) {
    let item = this.container.get(namespace);
    if (item !== undefined) {
      if (item.singleton && !item.instance) {
        item.instance = item.factory();
      }
      return item.singleton ? item.instance : item.factory();
    } else {
      throw new Error('未找到构造方法');
    }
  }
}


class UserService {
  constructor() {

  }
  test(name: string) {
    console.log(`my name is ${name}`);
  }
}

const container = new IOC();

container.bind<UserService>('UserService', UserService);

const userService = container.use('UserService');

userService.test('大史不说话');