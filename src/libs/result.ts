enum ResultEnum {
    Ok,
    Err
}

export class Result<T, E> {
    private readonly type: ResultEnum;
    private readonly value: T | E;

    private constructor(value: T | E, type: ResultEnum) {
        this.type = type;
        this.value = value;
    }

    static ok<T>(value: T): Result<T, never> {
        return new Result<T, never>(value, ResultEnum.Ok);
    }    

    static err<E>(value: E): Result<never, E> {
        return new Result<never, E>(value, ResultEnum.Err);
    }

    unwrap(): T {
        switch (this.type) {
            case ResultEnum.Ok:
                return this.value as T;
            case ResultEnum.Err:
                throw this.value;
        }
    }

    match<TR, TE>(ok: (value: T) => TR, err: (error: E) => TE): TR | TE {
        switch (this.type) {
            case ResultEnum.Ok:
                return ok(this.value as T);
            case ResultEnum.Err:
                return err(this.value as E);
        }
    }

    isOk(): boolean {
        return this.type === ResultEnum.Ok;
    }

    isErr(): boolean {
        return this.type === ResultEnum.Err;
    }
}
