import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as io from '@actions/io'
import * as os from 'os'
import * as path from 'path'
import { writeFile } from 'fs/promises'

// GitHub repository metadata for the Android Manifest Merger release.
const OWNER = 'distriqt'
const REPO = 'android-manifest-merger'

// Fetch the latest release metadata from GitHub and return the normalized version.
async function getLatestVersion(): Promise<string> {
  const response = await fetch(
    `https://github.com/${OWNER}/${REPO}/releases/latest`,
    { redirect: 'manual' }
  )

  const location = response.headers.get('location')

  if (!location) {
    throw new Error('Unable to determine latest release location from GitHub response')
  }

  const tag = location.split('/').pop()

  if (!tag) {
    throw new Error('Unable to extract version tag from GitHub redirect location')
  }

  return tag.replace(/^v/, '')
}

// Create the contents of the Unix wrapper script for `manifest-merger`.
function getUnixWrapperContents(jarName: string): string {
  return `#!/bin/sh
exec java -jar "$(dirname "$0")/${jarName}" "$@"
`
}

// Create the contents of the Windows wrapper script for `manifest-merger.cmd`.
function getWindowsWrapperContents(jarName: string): string {
  return ['@echo off', 'set DIR=%~dp0', `java -jar "%DIR%\\${jarName}" %*`].join('\r\n')
}

// Write wrapper scripts for both Unix and Windows platforms.
async function writeWrapperScripts(installDir: string, jarName: string): Promise<void> {
  const unixScriptPath = path.join(installDir, 'manifest-merger')
  const windowsScriptPath = path.join(installDir, 'manifest-merger.cmd')

  await writeFile(unixScriptPath, getUnixWrapperContents(jarName), { encoding: 'utf8', mode: 0o755 })
  await writeFile(windowsScriptPath, getWindowsWrapperContents(jarName), { encoding: 'utf8' })
}

// Main action entry point.
async function run(): Promise<void> {
  try {
    let version = core.getInput('version')

    if (!version) {
      core.info('Fetching latest Android Manifest Merger release from GitHub…')
      version = await getLatestVersion()
      core.info(`Using latest version: ${version}`)
    }

    const jarName = `manifest-merger-${version}.jar`
    const downloadUrl = `https://github.com/${OWNER}/${REPO}/releases/download/v${version}/${jarName}`

    core.info(`Downloading Android Manifest Merger ${version}…`)
    core.info(`URL: ${downloadUrl}`)

    const jarPath = await tc.downloadTool(downloadUrl)
    const installDir = path.join(os.homedir(), 'ManifestMerger', version)
    await io.mkdirP(installDir)

    const destinationJarPath = path.join(installDir, jarName)
    await io.cp(jarPath, destinationJarPath)

    await writeWrapperScripts(installDir, jarName)
    core.addPath(installDir)

    core.info(`✅ Android Manifest Merger ${version} installed and added to PATH.`)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()