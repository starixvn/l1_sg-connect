import config from "../configs.json";
import axios from "axios";

export type UMInfo = {
    start: Date;
    end: Date;
    finish: boolean;
    operatorId: string;
};
export const getUnfinishedUM = async (operatorId = ""): Promise<UMInfo> => {
    const path = operatorId ? `/um/getUnfinishedUM?operatorId=${operatorId}` : "/um/getUnfinishedUM";
    return axios.get<UMInfo>(`${config.userServiceApi}${path}`).then(({ data }) => data);
};
