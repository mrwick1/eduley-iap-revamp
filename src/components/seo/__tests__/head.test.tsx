import { render, waitFor } from '@testing-library/react';

import { Head } from '../head';
import { expect, test } from 'vitest';

test('should add proper page title and meta description', async () => {
    const title = 'Hello World';
    const titleSuffix = ' | Eduley Inc';
    const description = 'This is a description';

    render(<Head title={title} description={description} />);
    await waitFor(() => expect(document.title).toEqual(title + titleSuffix));

    const metaDescription = document.querySelector("meta[name='description']");

    expect(metaDescription?.getAttribute('content')).toEqual(description);
});
