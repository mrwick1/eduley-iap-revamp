import { Helmet, HelmetData } from 'react-helmet-async';

type HeadProps = {
    title?: string;
    description?: string;
};

const helmetData = new HelmetData({});

export const Head = ({ title = '', description = '' }: HeadProps = {}) => {
    return (
        <Helmet helmetData={helmetData} title={title ? `${title} | Eduley Inc` : undefined} defaultTitle="Eduley Inc">
            <meta name="description" content={description} />
        </Helmet>
    );
};
