// @ts-nocheck
/* eslint-env node, browser, jasmine */
import { describe, it, expect, beforeAll } from "vitest"
import { makeFixture } from "./makeFixture.js"
const path = require("path")

import { Errors, renameBranch, currentBranch } from "isomorphic-git"

describe("renameBranch", () => {
	it("branch already exists", async () => {
		// Setup
		const { fs, dir, gitdir } = await makeFixture("test-renameBranch")
		let error = null
		// Test
		try {
			await renameBranch({
				fs,
				dir,
				gitdir,
				oldref: "test-branch",
				ref: "master",
			})
		} catch (err) {
			error = err
		}
		expect(error).not.toBeNull()
		expect(error instanceof Errors.AlreadyExistsError).toBe(true)
	})

	it("invalid new branch name", async () => {
		// Setup
		const { fs, dir, gitdir } = await makeFixture("test-renameBranch")
		let error = null
		// Test
		try {
			await renameBranch({
				fs,
				dir,
				gitdir,
				oldref: "test-branch",
				ref: "inv@{id..branch.lock",
			})
		} catch (err) {
			error = err
		}
		expect(error).not.toBeNull()
		expect(error instanceof Errors.InvalidRefNameError).toBe(true)
	})

	it("invalid old branch name", async () => {
		// Setup
		const { fs, dir, gitdir } = await makeFixture("test-renameBranch")
		let error = null
		// Test
		try {
			await renameBranch({
				fs,
				dir,
				gitdir,
				ref: "other-branch",
				oldref: "inv@{id..branch.lock",
			})
		} catch (err) {
			error = err
		}
		expect(error).not.toBeNull()
		expect(error instanceof Errors.InvalidRefNameError).toBe(true)
	})

	it("missing ref argument", async () => {
		// Setup
		const { fs, dir, gitdir } = await makeFixture("test-renameBranch")
		let error = null
		// Test
		try {
			// @ts-ignore
			await renameBranch({ fs, dir, gitdir, oldref: "test-branch" })
		} catch (err) {
			error = err
		}
		expect(error).not.toBeNull()
		expect(error instanceof Errors.MissingParameterError).toBe(true)
	})

	it("missing oldref argument", async () => {
		// Setup
		const { fs, dir, gitdir } = await makeFixture("test-renameBranch")
		let error = null
		// Test
		try {
			// @ts-ignore
			await renameBranch({ fs, dir, gitdir, ref: "other-branch" })
		} catch (err) {
			error = err
		}
		expect(error).not.toBeNull()
		expect(error instanceof Errors.MissingParameterError).toBe(true)
	})

	it("rename branch", async () => {
		// Setup
		const { fs, dir, gitdir } = await makeFixture("test-renameBranch")
		// Test
		await renameBranch({
			fs,
			dir,
			gitdir,
			oldref: "test-branch",
			ref: "other-branch",
		})
		const files = await fs.readdir(path.join(gitdir, "refs", "heads"))
		expect(files.includes("test-branch")).toBe(false)
		expect(await currentBranch({ fs, dir, gitdir })).toEqual("master")
	})

	it("rename branch and checkout", async () => {
		// Setup
		const { fs, dir, gitdir } = await makeFixture("test-renameBranch")
		// Test
		await renameBranch({
			fs,
			dir,
			gitdir,
			oldref: "test-branch-2",
			ref: "other-branch-2",
			checkout: true,
		})
		expect(await currentBranch({ fs, dir, gitdir })).toEqual("other-branch-2")
	})
})
