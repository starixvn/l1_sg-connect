import config from "../configs.json";
import axios from "axios";

export type UMResult = {
    isUM: boolean;
    umInfo: UMInfo;
};

export type UMInfo = {
    start: Date;
    end: Date;
    finish: boolean;
    operatorId: string;
};
export const getUnfinishedUM = async (operatorId = ""): Promise<UMResult> => {
    const path = operatorId ? `/um/getUnfinishedUM?operatorId=${operatorId}` : "/um/getUnfinishedUM";
    return axios.get<UMResult>(`${config.userServiceApi}${path}`).then(({ data }) => data);
};
