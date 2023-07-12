FROM hub.lumigame.com/base/dotnet/core/sdk:7.0-alpine AS builder

WORKDIR /src

COPY ./SGConnect.Api/SGConnect.Api.csproj ./SGConnect.Api/SGConnect.Api.csproj

WORKDIR /src/SGConnect.Api
RUN dotnet restore -v diag

COPY ./SGConnect.Api .
RUN dotnet publish -r linux-x64 --self-contained false -o /app 

FROM hub.lumigame.com/base/dotnet/core/aspnet:7.0-alpine AS base
RUN useradd sg_connect_user
USER sg_connect_user

WORKDIR /app
COPY --from=builder /app .

ENTRYPOINT ["dotnet", "SGConnect.Api.dll"]
