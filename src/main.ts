import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as io from '@actions/io'
import * as os from 'os'
import * as path from 'path'
import { writeFile } from 'fs/promises'

const OWNER = 'distriqt'
const REPO = 'android-manifest-merger'
const GITHUB_LATEST_RELEASE = `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`

function normalizeVersion(tagName: string): string {
  return tagName.replace(/^v/, '')
}

async function getLatestVersion(): Promise<string> {
  const response = await fetch(GITHUB_LATEST_RELEASE, {
    headers: {
      accept: 'application/vnd.github+json',
      'user-agent': 'setup-manifest-merger-action'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch latest release: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as { tag_name?: string }
  if (!data.tag_name) {
    throw new Error('Unable to determine latest release tag from GitHub response')
  }

  return normalizeVersion(data.tag_name)
}

function getUnixWrapperContents(jarName: string): string {
  return `#!/bin/sh
exec java -jar "$(dirname "$0")/${jarName}" "$@"
`
}

function getWindowsWrapperContents(jarName: string): string {
  return ['@echo off', 'set DIR=%~dp0', `java -jar "%DIR%\\${jarName}" %*`].join('\r\n')
}

async function writeWrapperScripts(installDir: string, jarName: string): Promise<void> {
  const unixScriptPath = path.join(installDir, 'manifest-merger')
  const windowsScriptPath = path.join(installDir, 'manifest-merger.cmd')

  await writeFile(unixScriptPath, getUnixWrapperContents(jarName), { encoding: 'utf8', mode: 0o755 })
  await writeFile(windowsScriptPath, getWindowsWrapperContents(jarName), { encoding: 'utf8' })
}

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