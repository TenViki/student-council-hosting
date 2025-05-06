import { exec } from 'child_process';
import { promisify } from 'util';

export const runCommand = (
  command: string,
  options: { cwd?: string; onStdout?: (out: string) => void; redirectStderr?: boolean } = {}
): Promise<[null, string]|[string, null]> => {
  return new Promise((resolve, reject) => {
    const childProcess = exec(command, { cwd: options.cwd });

    let stdout = '';
    let stderr = '';

    if (childProcess.stdout) {
      childProcess.stdout.on('data', (data: string) => {
        options.onStdout?.(data);
        stdout += data;
      });
    }

    if (childProcess.stderr) {
      childProcess.stderr.on('data', (data: string) => {
        if (options.redirectStderr) {
          options.onStdout?.(data);
        }
        stderr += data;
      });
    }

    childProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        if (options.redirectStderr) {
          resolve([null, stderr]);
        } else {
          resolve([stdout, null]);
        }

        resolve([stdout, null]);
      }
    });

    childProcess.on('error', (error) => {
      reject(error);
    });
  });
};