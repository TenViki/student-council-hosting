import { exec } from 'child_process';
import { promisify } from 'util';

export const runCommand = async (command: string,
  options: { cwd?: string } = {}
): Promise<[string, null]|[null, string]> => {
  const execPromise = promisify(exec);
  try {
    const { stdout, stderr } = await execPromise(command, {
      cwd: options.cwd,
    });
    if (stderr) {
      console.error(`Error: ${stderr}`);
      return [null, stderr];
    }
    return [stdout, null];
  } catch (error) {
    throw error;
  }
}