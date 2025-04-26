export const success = (res: any, status: any, entity: any = null, msg: any) => res
    .status(status || 200)
    .json({
        success: true,
        message: msg || "Successful",
        payload: entity  || [],
    });

export const fail = (res: any, status: any, msg: any) => res
    .status(status || 500)
    .json({
        success: false,
        message: msg || "Failed",
        payload: [],
    });

