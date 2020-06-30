import { DotenvConfigOptions, config } from 'dotenv-flow';

export type PluginTransformResults = {
    code?: string;
    id?: string;
};

// https://stackoverflow.com/a/1144788/9238321
function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), replace);
}

export function env(options?: DotenvConfigOptions) {
    const { parsed: result } = config(options);
    let enviromentVars = { ...process.env, ...result };
    return {
        name: 'env',
        transform: (
            sourceText: string,
            id: string,
        ): Promise<PluginTransformResults> => {
            let code = sourceText;
            Object.keys(enviromentVars).forEach(key => {
                code = replaceAll(code, `process.env.${key}`, `"${enviromentVars[key]}"`);
            });
            return new Promise(resolve => {
                return resolve({
                    id,
                    code,
                });
            });
        },
    };
};