// @ts-nocheck
/* eslint-env node, browser, jasmine */
import { describe, it, expect, beforeAll } from "vitest"
import { makeFixture } from "./makeFixture.js"
import { deleteRef, listTags } from "isomorphic-git"

describe("deleteRef", () => {
	it("deletes a loose tag", async () => {
		// Setup
		const { fs, gitdir } = await makeFixture("test-deleteRef")
		// Test
		await deleteRef({
			fs,
			gitdir,
			ref: "refs/tags/latest",
		})
		const refs = await listTags({ fs, gitdir })
		expect(refs.includes("latest")).toEqual(false)
	})
	it("deletes a packed tag", async () => {
		// Setup
		const { fs, gitdir } = await makeFixture("test-deleteRef")
		// Test
		await deleteRef({
			fs,
			gitdir,
			ref: "refs/tags/packed-tag",
		})
		const refs = await listTags({ fs, gitdir })
		expect(refs.includes("packed-tag")).toEqual(false)
	})
	it("deletes a packed and loose tag", async () => {
		// Setup
		const { fs, gitdir } = await makeFixture("test-deleteRef")
		// Test
		await deleteRef({
			fs,
			gitdir,
			ref: "refs/tags/packed-and-loose",
		})
		const refs = await listTags({ fs, gitdir })
		expect(refs.includes("packed-and-loose")).toEqual(false)
		expect(refs.includes("packed-tag")).toEqual(true)
	})
})
