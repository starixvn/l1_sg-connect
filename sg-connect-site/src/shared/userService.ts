import appSettings from "@/common/app-settings";
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
    return axios.get<UMResult>(`${appSettings.userServiceApi}${path}`).then(({ data }) => data);
};
