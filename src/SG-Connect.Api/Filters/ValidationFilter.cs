using FluentValidation;

namespace SGConnect.Api.Filters
{
    public class ValidationFilter<T> : IEndpointFilter
    {
        public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
        {
            var model = context.GetArgument<T>(0);
            var validator = context.HttpContext.RequestServices.GetService<IValidator<T>>();
            var validatorResult = validator.Validate(model);

            if (validatorResult.IsValid)
            {
                return await next(context);
            }

            return Results.ValidationProblem(validatorResult.ToDictionary());
        }
    }
}