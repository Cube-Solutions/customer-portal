<?php

namespace Oro\Bundle\CustomerBundle\ImportExport\Serializer\Normalizer;

use Oro\Bundle\CustomerBundle\Entity\Customer;
use Oro\Bundle\ImportExportBundle\Serializer\Normalizer\ConfigurableEntityNormalizer;

class CustomerNormalizer extends ConfigurableEntityNormalizer
{
    /**
     * {@inheritdoc}
     * @param Customer $object
     */
    public function normalize($object, $format = null, array $context = [])
    {
        $result = parent::normalize($object, $format, $context);

        if (isset($result['owner']) && $object->getOwner()) {
            $result['owner']['id'] = $object->getOwner()->getId();
            unset($result['owner']['username']);
        }

        return $result;
    }

    /**
     * {@inheritdoc}
     */
    public function supportsNormalization($data, $format = null, array $context = [])
    {
        return $data instanceof Customer;
    }

}
