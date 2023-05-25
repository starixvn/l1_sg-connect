using FluentValidation;

namespace SGConnect.Api.Filters
{
    public class ValidationFilter<T> : IEndpointFilter
    {
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        {
            var model = context.GetArgument<T>(0);
            var validator = context.HttpContext.RequestServices.GetRequiredService<IValidator<T>>();
            var validatorResult = validator.Validate(model);

            if (validatorResult.IsValid)
            {
                return await next(context);
            }

            return Results.ValidationProblem(validatorResult.ToDictionary());
        }
    }
}