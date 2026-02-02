import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';

test('Fluxo completo de compra', async ({ page }) => {
	test.setTimeout(120000);
	const uniqueEmail = faker.internet.email();
	await page.goto('/');

	await page.locator('button:has(svg.lucide-user)').click();
	await page.getByRole('link', { name: /clique aqui para entrar/i }).click();
	await page.waitForURL('/signin');

	await page.getByRole('link', { name: /ainda não tem conta/i }).click();
	await page.waitForURL('/signup');

	await page.getByLabel('nome').fill('Usuario de Teste');
	await page.getByLabel('email').fill(uniqueEmail);
	await page.getByLabel('senha').fill('teste123');
	await page.getByRole('button', { name: /registrar/i }).click();
	await page.waitForURL('/signin');

	await page.getByLabel('email').fill(uniqueEmail);
	await page.getByLabel('senha').fill('teste123');
	await page.getByRole('button', { name: /entrar/i }).click();
	await page.waitForURL('/');

	await page.getByRole('searchbox').pressSequentially('Nike', { delay: 100 });
	await page
		.getByRole('link', { name: /Nike Air Force 1/i })
		.first()
		.click();
	await page.waitForURL(/.*\/product\/.+/);

	await expect(
		page.getByRole('heading', { name: /Nike Air Force 1/i }),
	).toBeVisible();

	await page.getByRole('button', { name: /adicionar ao carrinho/i }).click();

	await page.getByRole('button', { name: /abrir carrinho/i }).click();
	await page.getByRole('link', { name: /continuar a compra/i }).click();
	await page.waitForURL('/checkout');

	await expect(
		page.getByRole('heading', { name: /seu carrinho/i }),
	).toBeVisible();
	await page.getByRole('button', { name: /Finalizar/i }).click();
	await page.waitForURL('/order');

	await expect(
		page.getByRole('heading', { name: /finalizar compra/i }),
	).toBeVisible();
	await page.getByLabel('cep').fill('01001-000');
	await page.getByLabel('rua').fill('Avenida Paulista');
	await page.getByLabel('número').fill('1000');
	await page.getByLabel('bairro').fill('Bela Vista');
	await page.getByLabel('cidade').fill('São Paulo');
	await page.getByRole('combobox').filter({ hasText: 'Estado' }).click();
	await page.getByRole('option', { name: 'São Paulo', exact: true }).click();

	const createPaymentIntentResponse = page.waitForResponse(
		(response) =>
			response.url().includes('/graphql') && response.status() === 200,
	);

	await page.getByRole('button', { name: /continuar para pagamento/i }).click();

	await createPaymentIntentResponse;

	await expect(
		page.getByRole('button', { name: /continuar para pagamento/i }),
	).toBeHidden();

	const stripeIframe = await page.waitForSelector('iframe');
	const stripeFrame = await stripeIframe.contentFrame();

	if (!stripeFrame) {
		throw new Error('Stripe iframe não carregou corretamente');
	}

	await stripeFrame.getByRole('button', { name: /card/i }).click();

	await expect(
		stripeFrame.getByLabel(/número do cartão|card number/i),
	).toBeVisible({ timeout: 15000 });

	await stripeFrame
		.getByLabel(/número do cartão|card number/i)
		.fill('4242424242424242', { timeout: 5000 });
	await stripeFrame.getByPlaceholder('MM / YY').fill('12/34');
	await stripeFrame.getByPlaceholder('CVC').fill('123');

	await page.getByRole('button', { name: /pagar agora/i }).click();

	await page.waitForURL(/.*\/payment\/.+/);
	await expect(
		page.getByRole('heading', { name: /OBRIGADO PELA COMPRA!/i }),
	).toBeVisible();
});
