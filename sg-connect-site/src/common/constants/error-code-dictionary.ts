const ErrorCodeDictionary: { [key: string]: string } = {
    "10001": "underMaintain",
    "11002": "loginTooOften",
    "11004": "loginFailed",
    "11005": "loginFailed",
    "21511": "ipAccessDenied",
    "21514": "systemError",
    "21532": "useNickname",
    "21561": "lockedAccount",
    "21563": "closedAccount",
    "21702": "invalidToken",
    "1000": "errorOccurred",
    "1001": "sessionTimeout",
    "1002": "sessionTimeout",
    "2001": "loginFailed",
    "2002": "accountClosed",
    "2004": "ipRestricted",
    "2005": "accountBlacklisted",
    "4012": "userNotFound",
    "5002": "networkError",
    "5003": "sysMaintenance",
};

export default ErrorCodeDictionary;
