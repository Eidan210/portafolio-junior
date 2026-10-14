import { expect, test } from "@playwright/test";
import { projects } from "../src/data/projects";
import { caseStudyCopy } from "../src/data/ui";

test("todos los proyectos traen su caso de estudio", () => {
  expect(projects.filter((p) => !p.caseStudy).map((p) => p.id)).toEqual([]);
});

test("el caso de estudio se abre desde su tarjeta, muestra sus secciones y Esc lo cierra", async ({ page }) => {
  const project = projects.find((p) => p.caseStudy);
  test.skip(!project?.caseStudy, "ningún proyecto tiene caso de estudio");
  if (!project?.caseStudy) return;

  await page.goto(`./#proyecto-${project.id}`);
  const button = page.locator(`#proyecto-${project.id}`).getByRole("button", { name: caseStudyCopy.open });
  await button.click();

  const dialog = page.locator("dialog[open]");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(project.title);
  for (const section of [caseStudyCopy.problem, caseStudyCopy.solution, caseStudyCopy.decisions, caseStudyCopy.results, caseStudyCopy.learnings]) {
    await expect(dialog.getByRole("heading", { name: section })).toBeVisible();
  }
  await expect(dialog).toContainText(project.caseStudy.problem);
  await expect(dialog.getByRole("link", { name: caseStudyCopy.repo })).toHaveAttribute("href", project.repoUrl);

  await page.keyboard.press("Escape");
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await expect(button).toBeFocused();
});
