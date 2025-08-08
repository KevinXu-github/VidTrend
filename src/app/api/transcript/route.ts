import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json();
    
    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Call Python script
    const scriptPath = path.join(process.cwd(), 'scripts', 'get_transcript.py');
    
    return new Promise<NextResponse>((resolve) => {
      const python = spawn('python', [scriptPath, videoId]);
      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          resolve(
            NextResponse.json(
              { 
                success: false, 
                error: `Python script failed with code ${code}: ${stderr}` 
              },
              { status: 500 }
            )
          );
          return;
        }

        try {
          const result = JSON.parse(stdout);
          resolve(NextResponse.json(result));
        } catch (parseError) {
          resolve(
            NextResponse.json(
              { 
                success: false, 
                error: `Failed to parse Python output: ${parseError}` 
              },
              { status: 500 }
            )
          );
        }
      });

      python.on('error', (error) => {
        resolve(
          NextResponse.json(
            { 
              success: false, 
              error: `Failed to start Python process: ${error.message}` 
            },
            { status: 500 }
          )
        );
      });
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}